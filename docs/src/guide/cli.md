---
outline: deep
---

# Command Line Interface

The `fledge` command is an alias for `fledge create`.

### Usage

```bash
fledge
```

### Arguments

| Arguments       |                                                                                      |
| --------------- | ------------------------------------------------------------------------------------ |
| `[projectPath]` | Path where the project should be created. If omitted, the current directory is used. |

### Options

| Options                       |                                 |
| ----------------------------- | ------------------------------- |
| `-s, --source <stacksSource>` | Use the specified stacks source |
| `-a, --auth <auth>`           | Use authorization key           |
| `-c, --clear-cache`           | Clear stacks source cache       |

### Example

```bash
fledge create my-new-project # or fledge my-new-project -c -s ./my-stack-of-choice
```

::: tip
For detailed guidance on how to configure your own stack, please refer to the [configuration](/config) section.
:::

## Fledge Set

### Usage

```bash
fledge set  # Set configuration value
```

### Arguments

| Arguments |                     |
| --------- | ------------------- |
| `<key>`   | Configuration key   |
| `<value>` | Configuration value |

### Example

```bash
fledge set thisKey thatValue
```

## Fledge Get

### Usage

```bash
fledge get  # Get configuration value
```

### Arguments

| Arguments |                   |
| --------- | ----------------- |
| `<key>`   | Configuration key |

### Example

```bash
fledge get thisKey
```

## Fledge Cache

### Usage

```bash
fledge cache
```

### Commands

| Commands |                           |
| -------- | ------------------------- |
| `clear`  | Clear stacks source cache |

### Example

```bash
fledge cache clear
```
