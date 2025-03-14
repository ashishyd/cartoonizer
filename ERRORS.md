# Error Code Documentation

## Camera Errors

### `camera/access-denied`
- **Description**: User denied camera access
- **Resolution**:
    1. Check browser permissions
    2. Guide user to enable camera access
- **Log Context**:
  ```json
  {
    "browser": "string",
    "OS": "string",
    "permissionStatus": "denied"
  }
  ```

### `camera/init-failed`
- **Description**: Camera initialization failed
- **Possible Causes**:
    - Hardware failure
    - Driver issues
- **Troubleshooting Steps**:
    1. Verify camera functionality
    2. Restart application

## Capture Errors

### `capture/failed`
- **Description**: Image capture failed
- **Common Scenarios**:
    - Low memory
    - Browser compatibility issues