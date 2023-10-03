/** A configuration class that holds informations for `create express-app` command  */
export class CreateExpressConfig {
  /**
   * Holds the configurations from `create experss-app` command arguments and options.
   * @param {string} projectName - The name of the xarvis app.
   * @param {string} [outputDirectory] -  The optional desired output directory when creating a new project.
   * @param {string} [description] - The description for this xarvis project.
   * @param {string} [template] - The template for this project.
   */
  constructor(
    public projectName: string,
    public outputDirectory?: string,
    public description?: string,
    public template?: string
  ) {}

  /** Deafult description for Xarvis Express project. */
  static defaultDescription: string = 'An Express starter project created by Xarvis CLI.';

  /**
   * Get the nae of the project.
   * @returns {string} The project name.
   */
  getProjectName(): string {
    return this.projectName;
  }

  /**
   * Get the output directory, prompted by the user.
   * By default, returns the current working directory.
   * @returns {string} The output directory for the generated project.
   */
  getOutputDirectory(): string {
    return typeof this.outputDirectory === 'undefined' ? process.cwd() : this.outputDirectory;
  }

  /**
   * Get the description of the project.
   * If undefined, defaults to `An Express project created by Xarvis CLI.`
   * @returns {string} The description of the project
   */
  getDescription(): string {
    return this.description ?? CreateExpressConfig.defaultDescription;
  }

  /**
   * Get the template of the project.
   * If undefined, defaults to `javascript`.
   * @returns {string} The template for the project.
   */
  getTemplate(): string {
    return this.template ?? 'javascript';
  }

  /**
   * Whether to ask user to provide description for this project.
   * Returns `true` when no arguments were passed for description in `create express-app` command.
   * @returns {boolean} Whether to ask user about description.
   */
  shouldInquireDescription(): boolean {
    return this.description === CreateExpressConfig.defaultDescription;
  }

  /**
   * Whether to ask user to select template for this project.
   * Returns `true` when no arguments were passed for template in `create express-app` command.
   * @returns {boolean} Whether to ask user about template.
   */
  shouldInquireTemplate(): boolean {
    return typeof this.template === 'undefined';
  }

  /**
   * Prints [this] into a readable format.
   * @returns {string} The readable format of [this].
   */
  toString(): string {
    return (
      `CreateExpressConfig(projectName: ${this.getProjectName()}, outputDirectory: ${this.getOutputDirectory()}, ` +
      `description: ${this.getDescription()}, template: ${this.getTemplate()})`
    );
  }

  /**
   * Creates a new instance of `CreateExpressConfig` with updated values, based on the provided named parameters.
   *
   * @param {Object} options - An object containing the named parameters for updating the configuration.
   * @param {string} [options.projectName] - The updated name of the xarvis app.
   * @param {string} [options.outputDirectory] - The updated optional desired output directory when creating a new project.
   * @param {string} [options.description] - The updated description for this xarvis project.
   * @param {string} [options.template] - The updated template for this project.
   *
   * @returns {CreateExpressConfig} A new instance of `CreateExpressConfig` with the specified updates.
   */
  copyWith(options: {
    projectName?: string;
    outputDirectory?: string;
    description?: string;
    template?: string;
  }): CreateExpressConfig {
    return new CreateExpressConfig(
      options.projectName ?? this.projectName,
      options.outputDirectory ?? this.outputDirectory,
      options.description ?? this.description,
      options.template ?? this.template
    );
  }
}
