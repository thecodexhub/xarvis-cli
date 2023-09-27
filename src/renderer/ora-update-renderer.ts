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
  private startTime?: number;

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
          if (!this.startTime) {
            this.startTime = new Date().getTime();
          }
          this.spinner.start();
        }

        if (task.isCompleted()) {
          this.updateSpinnerText();
          this.spinner.succeed();
        }

        if (task.hasFailed()) {
          this.updateSpinnerText();
          this.spinner.fail();
        }

        if (task.isSkipped()) {
          this.updateSpinnerText();
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

  /**
   * Updates the sipnner text by adding elapsed time at the end of the task title.
   */
  updateSpinnerText(): void {
    const spinnerTexts = this.spinner.text.split('\n');
    spinnerTexts[0] = spinnerTexts[0].replace('...', '') + ' ' + chalk.dim(this.elapsedTime());

    this.spinner.text = spinnerTexts.join('\n');
  }

  /**
   * Calculates elapsed time. If the elapsed time is less than 100ms, it returns in milliseconds, otherwise
   * coverts into single decimal point seconds, and returns it.
   * @returns {string} Elapsed time in ms or s.
   */
  elapsedTime(): string {
    const timeNow = new Date().getTime();
    if (this.startTime) {
      const elapsedMilliseconds = timeNow - this.startTime;
      this.startTime = undefined;

      if (elapsedMilliseconds < 100) {
        return `(${elapsedMilliseconds}ms)`;
      }

      const elapsedSeconds = elapsedMilliseconds / 1000;
      const elapsedSecondsWithOneDecimalPoint = Math.round(elapsedSeconds * 10) / 10;

      return `(${elapsedSecondsWithOneDecimalPoint}s)`;
    }
    return ``;
  }
}
