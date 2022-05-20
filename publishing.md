-- LINUX --

-- version that will work on most desktop linux distros --
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/linux-x64/ --self-contained false --runtime linux-x64
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/linux-x64-portable/ --self-contained true --runtime linux-x64

-- version that will work on ARM processors --
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/linux-arm/ --self-contained false --runtime linux-arm
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/linux-arm64/ --self-contained false --runtime linux-arm64

-- WINDOWS --


-- version that will work on 64 bit windows machines --
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/windows-x64/ --self-contained false --runtime win-x64
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/windows-x64-portable/ --self-contained true --runtime win-x64

-- version that will work on 32 bit windows machines --
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/windows-x86/ --self-contained false --runtime win-x86
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/windows-x86-portable/ --self-contained true --runtime win-x86

-- version that will on ARM processors --
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/windows-arm/ --self-contained false --runtime win-arm
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/windows-arm64/ --self-contained false --runtime win-arm64

-- MAC --

-- Minimum OS version is macOS 10.12 Sierra --
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/osx-x64/ --self-contained false --runtime osx-x64
dotnet publish ./WebFTPSharp.sln -c Release -o ./bin/Release/publish/osx-x64-portable/ --self-contained true --runtime osx-x64