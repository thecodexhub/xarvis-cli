import Listr from 'listr';
import ora, { Ora } from 'ora';
import { CreateExpressProjectContext } from '../types';
import chalk from 'chalk';

/**
 * A custom renderer for Listr using Ora to display task updates in a command-line interface.
 *
 * @class OraUpdateRenderer
 */
export class OraUpdateRenderer {
  private readonly _tasks: ReadonlyArray<Listr.ListrTaskObject<CreateExpressProjectContext>>;
  private _options: Listr.ListrOptions<CreateExpressProjectContext>;
  private spinner: Ora;
  private indentation: number;

  /**
   * Creates an instance of OraUpdateRenderer.
   *
   * @param {ReadonlyArray<Listr.ListrTaskObject<CreateExpressProjectContext>>} tasks - An array of Listr tasks.
   * @param {Listr.ListrOptions<CreateExpressProjectContext>} options - Listr options.
   * @memberof OraUpdateRenderer
   */
  constructor(
    tasks: ReadonlyArray<Listr.ListrTaskObject<CreateExpressProjectContext>>,
    options: Listr.ListrOptions<CreateExpressProjectContext>
  ) {
    this._tasks = tasks;
    this._options = Object.assign({}, options);
    this.spinner = ora();
    this.indentation = 0;
  }

  /**
   * Indicates if the renderer is not compatible with non-TTY environments.
   *
   * @static
   * @type {boolean}
   * @memberof OraUpdateRenderer
   */
  static get nonTTY() {
    return true;
  }

  /**
   * Renders the Listr tasks using Ora for displaying updates.
   *
   * @memberof OraUpdateRenderer
   */
  render() {
    for (const task of this._tasks) {
      task.subscribe((_) => {
        this.spinner.text = '  '.repeat(this.indentation) + task.title;

        if (task.output) {
          this.spinner.text += chalk.dim(`\n${'  '.repeat(this.indentation + 1)}${task.output}`);
        }

        if (task.isPending()) {
          this.spinner.start();
        }

        if (task.isCompleted()) {
          this.spinner.succeed();
        }

        if (task.hasFailed()) {
          this.spinner.fail();
        }

        if (task.isSkipped()) {
          this.spinner.warn();
        }
      });
    }
  }

  /**
   * Called when the rendering process ends.
   *
   * @param {Error} err - Any error that occurred during rendering.
   * @memberof OraUpdateRenderer
   */
  end(err: Error): void {}
}
