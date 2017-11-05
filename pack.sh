#!/bin/sh

name="crx-chrome-sina"
zip -qr "$name-store.zip" extension

cp "$name-store.zip" "$name.zip"
zip -q "$name.zip" screenshots.png
f="readme.txt"
(cat README.md; echo; echo "[source](https://github.com/yanxyz/$name)") >> $f
zip -qml "$name.zip" $f
