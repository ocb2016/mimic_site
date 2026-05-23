#!/bin/bash
set -e

HTML_PATH="file:///home/ocb/Projects/MIMIC/mockups/mimic-amazon-startups/index.html"
OUTPUT_DIR="/home/ocb/Projects/MIMIC_Site/.browser-screenshots"
mkdir -p "$OUTPUT_DIR"

echo "=== Desktop (1440px) ==="
npx agent-browser open "$HTML_PATH" --size 1440x900 2>&1 | grep "✓"
npx agent-browser screenshot "$OUTPUT_DIR/desktop_top.png" 2>&1
npx agent-browser scroll 50% 2>&1 | tail -2
npx agent-browser screenshot "$OUTPUT_DIR/desktop_middle.png" 2>&1
npx agent-browser scroll 100% 2>&1 | tail -2
npx agent-browser screenshot "$OUTPUT_DIR/desktop_bottom.png" 2>&1
npx agent-browser close 2>&1

echo "=== Tablet (768px) ==="
npx agent-browser open "$HTML_PATH" --size 768x1024 2>&1 | grep "✓"
npx agent-browser screenshot "$OUTPUT_DIR/tablet_top.png" 2>&1
npx agent-browser scroll 50% 2>&1 | tail -2
npx agent-browser screenshot "$OUTPUT_DIR/tablet_middle.png" 2>&1
npx agent-browser scroll 100% 2>&1 | tail -2
npx agent-browser screenshot "$OUTPUT_DIR/tablet_bottom.png" 2>&1
npx agent-browser close 2>&1

echo "=== Mobile (375px) ==="
npx agent-browser open "$HTML_PATH" --size 375x812 2>&1 | grep "✓"
npx agent-browser screenshot "$OUTPUT_DIR/mobile_top.png" 2>&1
npx agent-browser scroll 50% 2>&1 | tail -2
npx agent-browser screenshot "$OUTPUT_DIR/mobile_middle.png" 2>&1
npx agent-browser scroll 100% 2>&1 | tail -2
npx agent-browser screenshot "$OUTPUT_DIR/mobile_bottom.png" 2>&1
npx agent-browser close 2>&1

echo "All screenshots saved to $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"
