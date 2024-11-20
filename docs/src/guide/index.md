---
outline: deep
---

# Getting Started

### 1. Install fledge cli:

```bash
npm i -g fledge
```

### 2. Set fledge source to the template-repository of your choice:

```bash
fledge config set source [template-source]
```

### 3. Create new personal access token:

[https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)

> **Required scope: repo**

### 4. Set fledge auth to the previously created access token:

```bash
fledge config set auth ghp_XXX
```

### 5. Create new project

```bash
fledge create my-new-project
```

### Congratulations! You created your first project with fledge! :rocket:
