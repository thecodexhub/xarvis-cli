import Listr from 'listr';

/**
 * Context for Listr in Create Express Project
 */
export type CreateExpressProjectContext = {
  yarn: boolean; // Indicates whether to use Yarn for package installation.
};

/**
 * Type Signature for the task function in Listr
 */
export type TaskFunction = (
  ctx: CreateExpressProjectContext,
  task: Listr.ListrTaskWrapper<CreateExpressProjectContext>
) => void;
