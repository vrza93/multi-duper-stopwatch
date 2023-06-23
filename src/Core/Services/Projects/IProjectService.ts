import {
  CreateProjectRequest,
  GetAllResult,
  GetResult,
  UpdateProjectRequest,
} from "../../Dto/Projects";
import { ProjectId } from "./Types";

export interface IProjectService {

  get(id: ProjectId): Promise<GetResult>;

  getAll(): Promise<GetAllResult>;

  create(request: CreateProjectRequest): Promise<void>;

  update(request: UpdateProjectRequest): Promise<void>;

  delete(id: ProjectId): Promise<void>;

}