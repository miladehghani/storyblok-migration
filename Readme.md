# Storyblok Migration

A CLI tool to run blok migrations on Storyblok.

## Installation

To install the Storyblok Migration CLI tool, run the following command:

```bash
npx storyblok-migration
```

## Usage

### Generate a new storyblok migration

To generate a new storyblok migration, use the following command:

```bash
storyblok-migration generate --oAuthToken <token> --space <spaceId> --component <componentName> [--id <migrationId>]
```

Replace `<token>` with your Storyblok OAuth token, `<spaceId>` with your Storyblok space ID, `<componentName>` with the original component technical name, and `<migrationId>` (optional) with a unique identifier for this migration. If not provided, the migration will be assigned a timestamp as the default identifier.

### Run a storyblok migration

To run a storyblok migration, use the following command:

```bash
storyblok-migration run --migrationFile <migrationFileName> --space <spaceId> [--dryrun]
```

Replace `<migrationFile>` with the path to the migration file, `<spaceId>` with your Storyblok space ID, and `<dryrun>` (optional) with `true` to run the migration in dryrun mode. If not provided, dryrun mode will be enabled by default.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
