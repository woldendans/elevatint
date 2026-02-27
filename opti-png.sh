#!/bin/bash
set -euo pipefail

# Lossless recompression at maximum effort (-o7 tries all filter/strategy combos).
# Modifies files in place; skips if already optimal.

optipng -o7 src/lib/assets/heightmaps/*.png
