# Events

This document outlines the events and how they related to the API and other
internal service handlers. By using events this allows certain actions to be
asynchronous and non-blocking.

## Queue/Processor Mapping Table

For convenience of all the queues/processors see this table below.

| Bull Queue         | Processor              |
| ------------------ | ---------------------- |
| doors-sequence-run | DoorsSequenceProcessor |
| doors-state-update | DoorsStateProcessor    |

## Door Sequence Processor

This is ran from the `doors-sequence-run` queue. It handles the asynchronous
running of door sequences. I.e. when the API or websocket initiates running
a sequence it simply pushes a message to the queue for processing.

```mermaid
---
title: Door Sequence Running
---
stateDiagram-v2
  state job_name <<choice>>

  [*] --> job_name
  job_name --> OpenJob: open
  job_name --> CloseJob: close
  job_name --> DefaultJob: default

  state OpenJob {
    FetchDoor1: Fetch door
    FetchDoorSequence1: Fetch door sequence
    RunEachSequenceObject1: Run each sequence object

    [*] --> FetchDoor1
    FetchDoor1 --> FetchDoorSequence1
    FetchDoorSequence1 --> RunEachSequenceObject1
    RunEachSequenceObject1 --> [*]
  }
  OpenJob --> [*]


  state CloseJob {
    FetchDoor2: Fetch door
    FetchDoorSequence2: Fetch door sequence
    RunEachSequenceObject2: Run each sequence object

    [*] --> FetchDoor2
    FetchDoor2 --> FetchDoorSequence2
    FetchDoorSequence2 --> RunEachSequenceObject2
    RunEachSequenceObject2 --> [*]
  }
  CloseJob --> [*]

  state DefaultJob {
    [*] --> LogInvalidJobName
    LogInvalidJobName --> [*]
  }
  DefaultJob --> [*]
```

## Door State Processor

This is ran from the `doors-state-update` queue and is responsible for updating
a doors state in the database/emitting via websockets.

Note: Sometimes there may have been a delay in this message arriving on this
queue (such as the door "opened" or "closed") as this occurs many seconds
after the sequence has completed.

```mermaid
---
title: Door State Update
---
stateDiagram-v2
  state job_name <<choice>>

  [*] --> FetchDoor
  FetchDoor --> job_name

  job_name --> SetStateClosed: closed
  job_name --> SetStateClosing: closing
  job_name --> SetStateOpen: open
  job_name --> SetStateOpening: opening
  job_name --> Return: default
  Return --> [*]

  SetStateClosed --> SaveDoorState
  SetStateClosing --> SaveDoorState
  SetStateOpen --> SaveDoorState
  SetStateOpening --> SaveDoorState

  SaveDoorState --> SaveAuditLog
  SaveAuditLog --> FindAllDoors
  FindAllDoors --> EmitDoorsList
  EmitDoorsList --> [*]
```
