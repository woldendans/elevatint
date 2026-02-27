#!/bin/bash
set -euo pipefail

DIR="src/lib/assets/heightmaps"

for png in "$DIR"/*.png; do
	out="${png%.png}_thumb.jpg"
	echo "$(basename "$png") → $(basename "$out")"
	magick "$png" -resize 500x500^ "$out"
done

echo "Done."
