import json
from shapely.geometry import LineString
from shapely.ops import polygonize, unary_union

data = json.load(open('edges_centered.json'))
edges_short = data['tower_short']['edges']  # list of [[u,v],[u,v]]

A = 7.5
B = A*0.5
FLARE_UV = -8  # u+v threshold: <= this is "upper module" (flareBase and above)

def proj(u,v):
    return (u-v)*A, (u+v)*B

def classify(u,v):
    return (u+v) <= FLARE_UV

# 1) edges -> JS array with per-point {x,y,up}
edge_pts = []
for (u1,v1),(u2,v2) in edges_short:
    x1,y1 = proj(u1,v1); x2,y2 = proj(u2,v2)
    edge_pts.append(((round(x1,2), round(y1,2), classify(u1,v1)), (round(x2,2), round(y2,2), classify(u2,v2))))

# 2) faces via polygonize
lines = [LineString([proj(*a), proj(*b)]) for a,b in edges_short]
merged = unary_union(lines)
polys = list(polygonize(merged))
faces = []
for poly in polys:
    coords = list(poly.exterior.coords)[:-1]  # drop closing dup
    pts = []
    for (x,y) in coords:
        u = (x/A + y/B)/2
        v = (y/B - x/A)/2
        pts.append((round(x,2), round(y,2), classify(round(u), round(v))))
    faces.append(pts)

print('FLARE_Y (px, base) =', FLARE_UV*B)
print('n_edges', len(edge_pts), 'n_faces', len(faces))

def js_pt(p):
    x,y,up = p
    return f'{{x:{x},y:{y},up:{1 if up else 0}}}'

with open('tower_gen.js', 'w') as f:
    f.write('// AUTO-GENERATED depuis ismoetric snow tower short.svg (grille magnetique) — ne pas modifier a la main\n')
    f.write(f'const SNOW_TOWER_FLARE_Y = {FLARE_UV*B};  // y (unites A=7.5,B=3.75) ou le module haut (plateforme+toit) commence\n')
    f.write('const SNOW_TOWER_EDGES = [\n')
    for a,b in edge_pts:
        f.write(f'  [{js_pt(a)}, {js_pt(b)}],\n')
    f.write('];\n')
    f.write('const SNOW_TOWER_FACES = [\n')
    for face in faces:
        f.write('  [' + ', '.join(js_pt(p) for p in face) + '],\n')
    f.write('];\n')
print('written tower_gen.js')
