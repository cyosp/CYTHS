# Podman instructions

## Build
```
podman build .. -f Containerfile -t cyths
```

## Run

### On Raspberry Pi
 - Disable default process attached to the serial port
```
sudo systemctl stop serial-getty@ttyAMA0.service
```
 - Add this option to `podman run` to allow container to access to serial port
```
--device=/dev/ttyAMA0
```

### With no data
```
podman run \
    -d \
    -p 8080:80 \
    --name cyths \
    cyths
```

### Demo
 - Ensure `config.json` is writable by *everybody* to be updated inside container
```
podman run \
    -d \
    -p 8080:80 \
    -v ./demo/data/config.json:/etc/cyths/config.json \
    -v ./demo/data/csv:/var/lib/cyths/csv \
    --name cyths-demo \
    cyths
```
