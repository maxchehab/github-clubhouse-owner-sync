import { DeploymentState } from './deployment-state.enum';

interface SubDeployment {
  updatedAt: number;
  state: DeploymentState;
}

export default interface Deployment {
  commit: string;
  frontend: SubDeployment;
  api: SubDeployment;
  state: DeploymentState;
}
