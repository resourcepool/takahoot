# Takahoot controller

The Takahoot controller is a standard unit which can connect up to 4 triggers with 6-pin JST 2.54mm cables.  
It is supposed to be connected to a computer via its USB cable.

## Serial protocol

### Inbound commands

#### IN_COMPUTER_CONNECTED (1-byte)
When the computer program connects to the controller, it should send a `IN_COMPUTER_CONNECTED` command.

| Byte 1  |
| ------------- |
| CMD  |
| 0x30  |


#### IN_COMPUTER_START_CALIBRATION (2-bytes)
Anytime we want to force the calibration of a target, this message can be sent.  
`TARGET_ID` can be anything from `0x00` to `0x03` (there are 4 targets maximum per controller).

| Byte 1  | Byte 2 |
| ------------- | ------------- |
| CMD  | TARGET_ID  |
| 0x31  | 0x00  |


#### IN_COMPUTER_CHANGE_TOLERANCE (3-bytes)
Each target has a default tolerance of `2`. Sometimes, this tolerance might not be perfect.
One can adjust the tolerance of each target by sending this command.

`TARGET_ID` can be anything from `0x00` to `0x03` (there are 4 targets maximum per controller).  
`TOLERANCE` can be anything from `0x01` to `0xFF`.  

| Byte 1  | Byte 2 | Byte 3 |
| ------------- | ------------- | ------------- |
| CMD  | TARGET_ID  | TOLERANCE  |
| 0x32  | 0x00  | 0x0F |


#### IN_COMPUTER_ENABLE_TARGET (2-bytes)
Send this command to enable any target. **Enable** means the target will record hits.

`TARGET_ID` can be anything from `0x00` to `0x03` (there are 4 targets maximum per controller).

| Byte 1  | Byte 2 |
| ------------- | ------------- |
| CMD  | TARGET_ID  |
| 0x34  | 0x00  |


#### IN_COMPUTER_DISABLE_TARGET (2-bytes)
Send this command to disable any target. **Disable** means the target wont record any hit.

`TARGET_ID` can be anything from `0x00` to `0x03` (there are 4 targets maximum per controller).

| Byte 1  | Byte 2 |
| ------------- | ------------- |
| CMD  | TARGET_ID  |
| 0x35  | 0x00  |


#### IN_COMPUTER_DISABLE_TARGET_AND_BLINK (2-bytes)
Send this command to disable any target and blink yellow. **Disable** means the target wont record any hit. This is useful to recognize which controller is which for instance.

`TARGET_ID` can be anything from `0x00` to `0x03` (there are 4 targets maximum per controller).

| Byte 1  | Byte 2 |
| ------------- | ------------- |
| CMD  | TARGET_ID  |
| 0x36  | 0x00  |


#### IN_COMPUTER_DISABLE_TARGETS_AND_BLINK (1-byte)
Send this command to disable all the targets of the controller and blink yellow. **Disable** means the target wont record any hit. This is useful to recognize which controller is which for instance.

| Byte 1  |
| ------------- |
| CMD  |
| 0x37  |


#### IN_COMPUTER_GET_STATE (1-byte)
Ask the controller to send its global state. This will result in an outbound `OUT_COMPUTER_CONTROLLER_STATE` message.

| Byte 1  |
| ------------- |
| CMD  |
| 0x38  |


#### IN_COMPUTER_RESET (1-byte)
Send this command to reset **both** each target **and** the **controller** itself.

| Byte 1  |
| ------------- |
| CMD  |
| 0x3F  |

### Outbound structures


`TARGET_X_STATE` is the state of target X. It consists of a sequence of 3 bytes (example for target 0).

| Byte 1  | Byte 2 | Byte 3 |
| ------------- | ------------- | ------------- |
| TARGET_ID  | STATE  | TOLERANCE  |
| 0x00  | 0b 0000 HEKC  | 0x0F |

**HEKC** are the 4 lower bits of the STATE byte :
 * **H** for Hit: set if target is hit
 * **E** for Enabled: set if target is enabled (accepts hits)
 * **K** for K(C)alibrating: set if target is currently being calibrated
 * **C** for Connected: set if target is connected to the controller

Examples:

 * `0x010302` : target 01 - connected and calibrating - tolerance 2
 * `0x030000` : target 03 - not connected
 * `0x000508` : target 00 - connected and enabled - tolerance 8
 * `0x000908` : target 00 - connected and hit - tolerance 8

### Outbound messages

#### OUT_COMPUTER_CONNECTED (15-bytes)
When the controller has successfully initialized itself, as a response to the `IN_COMPUTER_CONNECTED` command, it sends this command and the initial state of the target.


| Byte 1  | Byte 2-4  | Byte 5-7  | Byte 8-10  | Byte 11-13  |  Byte 14-15 |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| CMD  | TARGET_0_STATE  | TARGET_1_STATE  | TARGET_2_STATE  | TARGET_3_STATE  | END_MSG  |
| 0x80  | 0x000302  | 0x010302  | 0x020302  | 0x030302  | 0x0D0A  |

#### OUT_COMPUTER_CALIBRATION_STARTED (3-bytes)
When the controller has initialized a manual calibration (requested by the inbound command `IN_COMPUTER_START_CALIBRATION`). It is a response to that command.

| Byte 1  | Byte 2-3 |
| ------------- | ------------- |
| CMD  | END_MSG  |
| 0x81  | 0x0D0A  |

#### OUT_COMPUTER_CALIBRATION_FINISHED (15-bytes)
When all targets are done with calibration (whether manual or auto).

| Byte 1  | Byte 2-4  | Byte 5-7  | Byte 8-10  | Byte 11-13  |  Byte 14-15 |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| CMD  | TARGET_0_STATE  | TARGET_1_STATE  | TARGET_2_STATE  | TARGET_3_STATE  | END_MSG  |
| 0x82  | 0x000302  | 0x010302  | 0x020302  | 0x030302  | 0x0D0A  |

#### OUT_COMPUTER_TARGET_HIT (15-bytes)
When a target has been hit.

| Byte 1  | Byte 2-4  | Byte 5-7  | Byte 8-10  | Byte 11-13  |  Byte 14-15 |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| CMD  | TARGET_0_STATE  | TARGET_1_STATE  | TARGET_2_STATE  | TARGET_3_STATE  | END_MSG  |
| 0x84  | 0x000302  | 0x010302  | 0x020302  | 0x030302  | 0x0D0A  |


#### OUT_COMPUTER_CONTROLLER_STATE (15-bytes)
A response to the `IN_COMPUTER_GET_STATE` command.

| Byte 1  | Byte 2-4  | Byte 5-7  | Byte 8-10  | Byte 11-13  |  Byte 14-15 |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| CMD  | TARGET_0_STATE  | TARGET_1_STATE  | TARGET_2_STATE  | TARGET_3_STATE  | END_MSG  |
| 0x88  | 0x000302  | 0x010302  | 0x020302  | 0x030302  | 0x0D0A  |
