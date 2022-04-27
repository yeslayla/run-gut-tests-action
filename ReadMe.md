![Release Version](https://img.shields.io/github/v/release/manleydev/run-gut-tests-action) ![Test Action](https://github.com/manleydev/run-gut-tests-action/workflows/Test%20Action/badge.svg)

# Run GUT tests
This is an action that runs [GUT](https://github.com/bitwes/Gut) tests for Godot to easily automate testing.

## Usage

This action will run [GUT](https://github.com/bitwes/Gut) tests inside of a docker image for your Godot project.

Example:

```yaml
steps:
- uses: manleydev/run-gut-tests-action@[VERSION]
  with:
    directory: client
```

### Inputs

#### containerImage

    The docker image  where GUT tests are inside of. Defaults to `barichello/godot-ci:latest`

#### directory

    The name directory to run tests within. Defaults to the current directory.

#### useContainer

    Boolean value of whether or not to run container. Defaults to `true`

#### godotExecutable

    Path of Godot binary to call when running GUT tests. Defaults to `godot`


## Configure GUT

This action requires you to configure GUT using the `.gutconfig.json` file which would be located in the root directory of your project.

Here is an example `.gutconfig.json`:

```json
{
    "dirs":[
        "res://tests/"
    ],
    "include_subdirs":true,
    "ignore_pause":true,
    "log_level":2,
    "should_exit":true,
    "should_maximize":false
}
```

For more information on the config file, [see the GUT wiki](https://github.com/bitwes/Gut/wiki/Command-Line#config-file).
