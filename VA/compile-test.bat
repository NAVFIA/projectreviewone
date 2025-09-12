@echo off
echo Cleaning target directory...
if exist target rmdir /s /q target

echo Compiling application...
call mvnw.cmd compile

echo Done!
pause