"""Obabko Dent — test scene: a cute tooth notices a caries spot.

Builds the scene, animates it (5 s, 24 fps, 9:16) and saves a .blend.
Rendering uses Cycles on CPU (EEVEE needs a GPU/EGL context).

Usage (from the project root):
  .venv/bin/python blender/obabko-dent/scripts/tooth_test.py             # build + save .blend
  .venv/bin/python blender/obabko-dent/scripts/tooth_test.py --still 70  # + render one frame
  .venv/bin/python blender/obabko-dent/scripts/tooth_test.py --render    # + render all frames to PNG
"""

import math
import os
import sys

import bpy
import addon_utils  # noqa: E402 (available only after importing bpy)
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLEND_PATH = os.path.join(ROOT, "tooth_test.blend")
FRAMES_DIR = os.path.join(ROOT, "out", "frames")

FPS = 24
FRAME_END = 5 * FPS  # 120
RES_X, RES_Y = 720, 1280

# ---------------------------------------------------------------- helpers


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    addon_utils.enable("cycles", default_set=True)


def material(name, color, roughness=0.5, emission=0.0, subsurface=0.0, coat=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if subsurface:
        bsdf.inputs["Subsurface Weight"].default_value = subsurface
        bsdf.inputs["Subsurface Scale"].default_value = 0.08
    if coat:
        bsdf.inputs["Coat Weight"].default_value = coat
        bsdf.inputs["Coat Roughness"].default_value = 0.1
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission
    return mat


def link(obj, parent=None):
    bpy.context.scene.collection.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


def empty(name, loc=(0, 0, 0), parent=None):
    obj = bpy.data.objects.new(name, None)
    obj.location = loc
    return link(obj, parent)


def sphere(name, radius, loc, mat, parent=None, scale=(1, 1, 1), segments=48):
    import bmesh

    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segments, v_segments=segments // 2, radius=radius)
    bm.to_mesh(mesh)
    bm.free()
    mesh.shade_smooth()
    mesh.materials.append(mat)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    obj.scale = scale
    return link(obj, parent)


def capsule(name, radius, length, mat, parent=None):
    """Cylinder hanging down from the parent's origin along -Z."""
    import bmesh

    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=radius, radius2=radius, depth=length)
    bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, -length / 2))
    bm.to_mesh(mesh)
    bm.free()
    mesh.shade_smooth()
    mesh.materials.append(mat)
    return link(bpy.data.objects.new(name, mesh), parent)


def bezier(name, points, mat, parent=None, bevel=0.035, loc=(0, 0, 0)):
    """points: list of (co, handle_left, handle_right) in the object's local space."""
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = bevel
    curve.bevel_resolution = 6
    curve.use_fill_caps = True
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, (co, hl, hr) in zip(spline.bezier_points, points):
        bp.handle_left_type = bp.handle_right_type = "FREE"
        bp.co, bp.handle_left, bp.handle_right = co, hl, hr
    curve.materials.append(mat)
    obj = bpy.data.objects.new(name, curve)
    obj.location = loc
    return link(obj, parent)


def key(obj, path, frame, value, index=-1):
    setattr(obj, path, value)
    obj.keyframe_insert(path, frame=frame, index=index)


def keys(obj, path, frames_values):
    for f, v in frames_values:
        key(obj, path, f, v)


def deg(*a):
    return tuple(math.radians(x) for x in a)


# ---------------------------------------------------------------- world


def build_set():
    scene = bpy.context.scene
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.45, 0.72, 0.92, 1)
    bg.inputs["Strength"].default_value = 0.55
    scene.world = world

    # Seamless cyclorama: floor that curves up into a back wall.
    profile = []
    for i in range(12):
        profile.append((-12 + i * 1.2, 0.0))
    r = 3.0
    for i in range(1, 13):
        a = math.radians(90 * i / 12)
        profile.append((2.0 + r * math.sin(a), r - r * math.cos(a)))
    profile.append((5.0, 14.0))
    verts, faces = [], []
    xs = (-14, 14)
    for x in xs:
        for y, z in profile:
            verts.append((x, y, z))
    n = len(profile)
    for i in range(n - 1):
        faces.append((i, i + 1, n + i + 1, n + i))
    mesh = bpy.data.meshes.new("Cyc")
    mesh.from_pydata(verts, [], faces)
    mesh.shade_smooth()
    mesh.materials.append(material("Backdrop", (0.25, 0.62, 0.85), roughness=0.9))
    link(bpy.data.objects.new("Cyclorama", mesh))

    def area(name, loc, power, size, color=(1, 1, 1)):
        data = bpy.data.lights.new(name, "AREA")
        data.energy, data.size, data.color = power, size, color
        obj = link(bpy.data.objects.new(name, data))
        obj.location = loc
        direction = Vector((0, 0, 1.3)) - Vector(loc)
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

    area("Key", (-3.5, -4.5, 5.0), 900, 4.0, (1.0, 0.96, 0.9))
    area("Fill", (4.5, -3.5, 2.5), 300, 5.0, (0.85, 0.92, 1.0))
    area("Rim", (1.5, 3.5, 4.5), 700, 3.0)


# ---------------------------------------------------------------- character


def build_tooth():
    rig = empty("ToothRig")

    # Body: metaball molar (two cusps on top, two rounded roots below).
    mb = bpy.data.metaballs.new("ToothMeta")
    mb.resolution = mb.render_resolution = 0.035
    def elem(kind, co, radius, sx=1, sy=1, sz=1):
        e = mb.elements.new(type=kind)
        e.co, e.radius = co, radius
        if kind == "ELLIPSOID":
            e.size_x, e.size_y, e.size_z = sx, sy, sz
    elem("ELLIPSOID", (0, 0, 1.35), 1.0, 1.0, 1.35, 0.85)
    elem("BALL", (-0.45, 0, 1.95), 0.62)
    elem("BALL", (0.45, 0, 1.95), 0.62)
    elem("ELLIPSOID", (-0.4, 0, 0.7), 0.6, 1.0, 1.3, 1.3)
    elem("ELLIPSOID", (0.4, 0, 0.7), 0.6, 1.0, 1.3, 1.3)
    meta_obj = link(bpy.data.objects.new("ToothMetaTmp", mb))
    bpy.context.view_layer.update()
    mesh = bpy.data.meshes.new_from_object(meta_obj.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(meta_obj)
    mesh.name = "ToothBody"
    mesh.shade_smooth()
    tooth_mat = material("Enamel", (0.97, 0.94, 0.87), roughness=0.22, subsurface=0.15, coat=0.4)
    mesh.materials.append(tooth_mat)
    body = link(bpy.data.objects.new("ToothBody", mesh), rig)
    bpy.context.view_layer.update()

    def surface(x, z, direction=(0, 1, 0)):
        """Front surface point + normal of the body (rig is at rest = world space)."""
        d = Vector(direction)
        ok, p, n, _ = body.ray_cast(Vector((x, z * 0, z)) - d * 6, d)
        if not ok:
            raise RuntimeError(f"ray missed body at x={x} z={z}")
        return p, n

    def bottom(x):
        ok, p, _, _ = body.ray_cast(Vector((x, 0, -3)), Vector((0, 0, 1)))
        return p.z

    print("body front at center:", surface(0, 1.35)[0], " bottom:", bottom(0.4))

    black = material("Pupil", (0.02, 0.02, 0.03), roughness=0.15)
    white = material("EyeWhite", (0.98, 0.98, 0.98), roughness=0.2)
    shine = material("Shine", (1, 1, 1), emission=6.0)
    mouth_mat = material("Mouth", (0.35, 0.05, 0.07), roughness=0.4)
    blush_mat = material("Blush", (1.0, 0.55, 0.6), roughness=0.6)
    limb_mat = material("Limb", (0.96, 0.95, 0.92), roughness=0.3, subsurface=0.1)
    shoe_mat = material("Shoe", (0.12, 0.55, 0.85), roughness=0.35)
    caries_mat = material("Caries", (0.07, 0.04, 0.025), roughness=0.85)
    brow_mat = material("Brow", (0.15, 0.1, 0.08), roughness=0.5)
    drop_mat = material("Sweat", (0.55, 0.85, 1.0), roughness=0.05)

    # Eyes
    eye_z = 1.62
    eyes = []
    for side, x in (("L", -0.36), ("R", 0.36)):
        p, n = surface(x, eye_z)
        root = empty(f"Eye{side}", p - n * 0.03, rig)
        sphere(f"EyeWhite{side}", 0.28, (0, 0, 0), white, root)
        pivot = empty(f"PupilPivot{side}", (0, 0, 0), root)
        sphere(f"Pupil{side}", 0.135, (0, -0.25, 0), black, pivot, scale=(1, 0.45, 1))
        sphere(f"Shine{side}", 0.04, (0.05, -0.31, 0.06), shine, pivot, segments=16)
        sphere(f"Shine2{side}", 0.02, (-0.04, -0.31, -0.05), shine, pivot, segments=12)
        eyes.append((root, pivot))

    # Brows
    brows = []
    for side, x in (("L", -0.36), ("R", 0.36)):
        p, n = surface(x, eye_z + 0.4)
        pts = [((-0.12, 0, -0.01), (-0.16, 0, -0.02), (-0.08, 0, 0.0)),
               ((0, 0, 0.025), (-0.05, 0, 0.025), (0.05, 0, 0.025)),
               ((0.12, 0, -0.01), (0.08, 0, 0.0), (0.16, 0, -0.02))]
        brows.append(bezier(f"Brow{side}", pts, brow_mat, rig, bevel=0.028, loc=p - n * 0.01))

    # Blush
    for side, x in (("L", -0.56), ("R", 0.56)):
        p, n = surface(x, 1.3)
        b = sphere(f"Blush{side}", 0.12, p - n * 0.005, blush_mat, rig, scale=(1, 0.25, 0.6))
        b.rotation_euler = n.to_track_quat("Y", "Z").to_euler()

    # Mouth: curve with shape keys (Basis = soft smile, Smile = grin, Worry = frown)
    mouth_z = 1.18

    def mouth_pts(shape):
        out = []
        for (x, dz), hx in shape:
            p, _ = surface(x, mouth_z + dz)
            pl, _ = surface(x - hx, mouth_z + dz)
            pr, _ = surface(x + hx, mouth_z + dz)
            off = Vector((0, -0.02, 0))
            out.append((p + off, pl + off, pr + off))
        return out

    soft = [((-0.2, 0.04), 0.07), ((0.0, -0.05), 0.08), ((0.2, 0.04), 0.07)]
    grin = [((-0.3, 0.11), 0.1), ((0.0, -0.15), 0.15), ((0.3, 0.11), 0.1)]
    worry = [((-0.18, -0.07), 0.06), ((0.0, 0.0), 0.06), ((0.18, -0.07), 0.06)]
    mouth = bezier("Mouth", mouth_pts(soft), mouth_mat, rig, bevel=0.035)
    mouth.shape_key_add(name="Basis")
    for name, shape in (("Smile", grin), ("Worry", worry)):
        kb = mouth.shape_key_add(name=name, from_mix=False)
        for d, (co, hl, hr) in zip(kb.data, mouth_pts(shape)):
            d.co, d.handle_left, d.handle_right = co, hl, hr

    p, n = surface(0, mouth_z - 0.04)
    mouth_o = sphere("MouthO", 0.13, p - n * 0.01, mouth_mat, rig, scale=(0.0, 0.0, 0.0))

    # Caries: dark irregular spot on the lower right of the body (viewer's right)
    caries = empty("Caries", (0, 0, 0), rig)
    for i, (x, z, r) in enumerate(((0.58, 0.82, 0.13), (0.68, 0.9, 0.08), (0.52, 0.72, 0.07))):
        p, n = surface(x, z)
        c = sphere(f"CariesSpot{i}", r, p - n * 0.01, caries_mat, caries, scale=(1, 0.3, 1.1))
        c.rotation_euler = n.to_track_quat("Y", "Z").to_euler()

    # Arms: shoulder pivots, rotating around Y (in the camera plane)
    arms = []
    for side, x, sign in (("L", -0.66, 1), ("R", 0.66, -1)):
        shoulder = empty(f"Shoulder{side}", (x, -0.05, 1.25), rig)
        capsule(f"Arm{side}", 0.075, 0.62, limb_mat, shoulder)
        sphere(f"Hand{side}", 0.14, (0, 0, -0.7), limb_mat, shoulder)
        shoulder.rotation_euler = deg(0, 35 * sign, 0)
        arms.append((shoulder, sign))

    # Legs + shoes
    for side, x in (("L", -0.38), ("R", 0.38)):
        top = bottom(x) + 0.1
        hip = empty(f"Hip{side}", (x, 0, top), rig)
        capsule(f"Leg{side}", 0.08, top - 0.12, limb_mat, hip)
        sphere(f"Shoe{side}", 0.17, (0, -0.07, -(top - 0.1)), shoe_mat, hip, scale=(1, 1.35, 0.6))

    # Sweat drop
    p, n = surface(-0.62, 1.95)
    drop = sphere("Sweat", 0.07, p - n * 0.02 + Vector((0, -0.05, 0)), drop_mat, rig, scale=(0, 0, 0))

    return dict(rig=rig, eyes=eyes, brows=brows, mouth=mouth, mouth_o=mouth_o, arms=arms, drop=drop)


# ---------------------------------------------------------------- camera


def build_camera():
    target = empty("CamTarget", (0, 0, 1.35))
    data = bpy.data.cameras.new("Camera")
    data.lens = 50
    data.sensor_fit = "VERTICAL"
    data.sensor_height = 36
    cam = link(bpy.data.objects.new("Camera", data))
    cam.location = (0, -7.2, 1.8)
    con = cam.constraints.new("TRACK_TO")
    con.target, con.track_axis, con.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"
    bpy.context.scene.camera = cam
    return cam, target


# ---------------------------------------------------------------- animation


def animate(t, cam, target):
    rig, mouth, mouth_o, drop = t["rig"], t["mouth"], t["mouth_o"], t["drop"]
    smile = mouth.data.shape_keys.key_blocks["Smile"]
    worry = mouth.data.shape_keys.key_blocks["Worry"]

    # Idle breathing (squash/stretch) until the shock
    for f in range(1, 64, 12):
        key(rig, "scale", f, (1, 1, 1))
        key(rig, "scale", f + 6, (0.985, 0.985, 1.025))

    # 1) Blink
    for root, _ in t["eyes"]:
        keys(root, "scale", [(17, (1, 1, 1)), (20, (1, 1, 0.08)), (23, (1, 1, 1))])

    # 2) Big smile + wave (right arm, viewer's right)
    keys(smile, "value", [(22, 0.0), (30, 1.0), (50, 1.0), (60, 0.0)])
    shoulder_r, sign_r = t["arms"][1]
    keys(shoulder_r, "rotation_euler", [
        (24, deg(0, -35, 0)), (31, deg(0, -150, 0)), (35, deg(0, -125, 0)),
        (39, deg(0, -155, 0)), (43, deg(0, -125, 0)), (47, deg(0, -150, 0)), (56, deg(0, -35, 0)),
    ])

    # 3) Notices the caries: pupils look down-right, camera pushes in
    for _, pivot in t["eyes"]:
        keys(pivot, "rotation_euler", [
            (50, deg(0, 0, 0)), (57, deg(24, 0, 22)), (90, deg(24, 0, 22)),
            (97, deg(0, 0, 0)),
        ])
    keys(cam, "location", [(1, (0, -7.2, 1.8)), (50, (0, -7.0, 1.8)), (64, (0.25, -6.3, 1.6)),
                           (100, (0.2, -6.1, 1.65)), (120, (0.1, -5.9, 1.7))])
    keys(target, "location", [(50, (0, 0, 1.35)), (64, (0.2, 0, 1.2)), (100, (0.15, 0, 1.25)),
                              (120, (0.05, 0, 1.3))])

    # Double-take blink, then eyes widen
    for root, _ in t["eyes"]:
        keys(root, "scale", [(60, (1, 1, 1)), (62, (1, 1, 0.08)), (64, (1, 1, 1)),
                             (70, (1.12, 1.12, 1.16)), (90, (1.1, 1.1, 1.13)), (100, (1.04, 1.04, 1.06))])

    # 4) Shock: startled hop, open "O" mouth, worried brows, arms up
    keys(rig, "location", [(64, (0, 0, 0)), (69, (0, 0, 0.28)), (74, (0, 0, 0))])
    keys(rig, "scale", [(64, (1, 1, 1)), (67, (0.94, 0.94, 1.08)), (74, (1.06, 1.06, 0.92)),
                        (78, (1, 1, 1))])
    keys(mouth, "scale", [(64, (1, 1, 1)), (67, (0, 0, 0)), (84, (0, 0, 0)), (88, (1, 1, 1))])
    keys(mouth_o, "scale", [(65, (0, 0, 0)), (70, (1, 0.35, 1.3)), (82, (0.9, 0.35, 1.15)),
                            (86, (0, 0, 0))])
    keys(worry, "value", [(84, 0.0), (86, 1.0)])
    for brow, sign in zip(t["brows"], (1, -1)):
        keys(brow, "rotation_euler", [(64, deg(0, 0, 0)), (70, deg(0, -32 * sign, 0))])
        keys(brow, "location", [(64, brow.location.copy()),
                                (70, brow.location + Vector((0, 0, 0.06)))])
    for shoulder, sign in t["arms"]:
        keys(shoulder, "rotation_euler", [
            (64, deg(0, 35 * sign, 0)), (70, deg(0, 145 * sign, 0)), (84, deg(0, 140 * sign, 0)),
            (92, deg(0, 70 * sign, 0)),
        ])

    # 5) Worried trembling + sweat drop
    for i, f in enumerate(range(88, 121, 2)):
        key(rig, "location", f, (0.012 if i % 2 else -0.012, 0, 0))
    start = drop.location.copy()
    keys(drop, "scale", [(86, (0, 0, 0)), (90, (1, 1, 1.35))])
    keys(drop, "location", [(90, start), (118, start + Vector((-0.12, -0.02, -0.55)))])


# ---------------------------------------------------------------- render setup


def setup_render():
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.samples = 24
    s.cycles.use_adaptive_sampling = True
    s.cycles.adaptive_threshold = 0.03
    s.cycles.use_denoising = True
    s.cycles.denoiser = "OPENIMAGEDENOISE"
    s.cycles.max_bounces = 4
    s.cycles.caustics_reflective = s.cycles.caustics_refractive = False
    s.render.resolution_x, s.render.resolution_y = RES_X, RES_Y
    s.render.resolution_percentage = 100
    s.render.fps = FPS
    s.frame_start, s.frame_end = 1, FRAME_END
    s.render.image_settings.file_format = "PNG"
    s.render.filepath = os.path.join(FRAMES_DIR, "frame_")
    s.view_settings.view_transform = "AgX"
    try:
        s.view_settings.look = "AgX - Punchy"
    except TypeError:
        pass


def main():
    args = sys.argv[1:]
    reset_scene()
    build_set()
    tooth = build_tooth()
    cam, target = build_camera()
    animate(tooth, cam, target)
    setup_render()
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print("saved", BLEND_PATH)

    if "--still" in args:
        frame = int(args[args.index("--still") + 1])
        s = bpy.context.scene
        s.frame_set(frame)
        s.render.filepath = os.path.join(ROOT, "out", f"still_{frame:03d}.png")
        bpy.ops.render.render(write_still=True)
    if "--render" in args:
        bpy.ops.render.render(animation=True)


if __name__ == "__main__":
    main()
