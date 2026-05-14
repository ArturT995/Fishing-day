# this script is used in blender console to turn y vertices into a list of sizes to be used when making fish

import bpy
import math
obj = bpy.context.object
verts = obj.data.vertices
radii = []
for v in verts:
    radii.append(round(v.co.y, 1))

print(radii)
