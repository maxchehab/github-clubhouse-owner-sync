import { DeploymentState } from './deployment-state.enum';

interface SubDeployment {
  updatedAt: number;
  state: DeploymentState;
}

export default interface Session {
  id: string;
  name: string;
  expires_at: number;
  token: string;
}
