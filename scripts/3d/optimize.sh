#!/usr/bin/env sh
# Usage: npm run model:optimize -- path/to/raw-model.glb
# Compresses a generated GLB for the web and writes it to public/models/aarav.glb.
# Meshopt geometry compression + WebP textures (max 2048px), duplicate/unused data pruned.
set -e
IN="${1:?usage: npm run model:optimize -- input.glb}"
OUT="public/models/aarav.glb"
mkdir -p public/models
npx --yes @gltf-transform/cli optimize "$IN" "$OUT" \
  --compress meshopt \
  --texture-compress webp \
  --texture-size 2048
echo "wrote $OUT"
npx --yes @gltf-transform/cli inspect "$OUT" | head -40
