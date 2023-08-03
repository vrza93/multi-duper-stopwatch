import { inject, injectable } from "inversify";
import { DataSource, Repository } from "typeorm";
import { ServiceIdentifier } from "../Config";
import { ILoggerService } from "../Core/Services/Logger";
import {
  Action,
  ActionInProject,
  Info,
  Project,
  Session,
  SessionLog,
  Setting,
} from "./Entities";
import { IDatabaseService } from "./IDatabaseService";

@injectable()
export class DatabaseService implements IDatabaseService {

  private readonly _dataSource: DataSource;

  private readonly _loggerService: ILoggerService;

  public readonly actions = (): Repository<Action> => this._dataSource.getRepository(Action);

  public readonly actionsInProjects = (): Repository<ActionInProject> => this._dataSource.getRepository(ActionInProject);

  public readonly infos = (): Repository<Info> => this._dataSource.getRepository(Info);

  public readonly projects = (): Repository<Project> => this._dataSource.getRepository(Project);

  public readonly sessions = (): Repository<Session> => this._dataSource.getRepository(Session);

  public readonly sessionLogs = (): Repository<SessionLog> => this._dataSource.getRepository(SessionLog);

  public readonly settings = (): Repository<Setting> => this._dataSource.getRepository(Setting);

  constructor(
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService,
  ) {
    const dataSource = new DataSource({
      type: "react-native",
      database: "table_20230715_1227",
      location: "default",
      logger: "debug",
      synchronize: false,
      entities: [
        Action,
        ActionInProject,
        Info,
        Project,
        Session,
        SessionLog,
        Setting,
      ],
    });

    this._dataSource = dataSource;
    this._loggerService = loggerService;
  }

  public async open(): Promise<void> {
    this._loggerService.debug(DatabaseService.name, this.open.name);

    if (!this._dataSource.isInitialized) {
      await this._dataSource.initialize();
    }
  }

  public close(): Promise<void> {
    this._loggerService.debug(DatabaseService.name, this.close.name);
    return this._dataSource.destroy();
  }

  public async execute<TResult>(action: { (): Promise<TResult> }, name?: string | undefined): Promise<TResult> {
    try {
      this._loggerService.debug(
        DatabaseService.name,
        this.execute.name,
        name ?? "action"
      );

    await this.open();

    return await action();
    } finally {
      this._loggerService.debug(
        DatabaseService.name,
        this.execute.name,
        name ?? "action",
        "completed"
      );
    }
  }

}
