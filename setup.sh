yum install wget

wget https://github.com/NixOS/patchelf/archive/refs/tags/0.17.0.tar.gz
tar -xf 0.17.0.tar.gz
cd patchelf-0.17.0
./bootstrap.sh
./configure
make
make install
cd ..

wget https://zlib.net/fossils/zlib-1.2.9.tar.gz
tar -xf zlib-1.2.9.tar.gz
cd zlib-1.2.9
sh configure
make
cp libz.so.1.2.9 ../node_modules/canvas/build/Release/libz.so.X
cd ..

wget http://nixos.org/releases/patchelf/patchelf-0.10/patchelf-0.10.tar.bz2
tar xf patchelf-0.10.tar.bz2
cd patchelf-0.10
./configure --prefix="$HOME/.local"
make install
strip --strip-unneeded ~/.local/bin/patchelf
gzip -9 ~/.local/share/man/man1/patchelf.1

patchelf --replace-needed /lib64/libz.so.1 libz.so.X ./node_modules/canvas/build/Release/libpng16.so.16
patchelf --replace-needed libz.so.1 libz.so.X ./node_modules/canvas/build/Release/libpng16.so.16