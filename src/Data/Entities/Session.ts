import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { SessionState } from "../Enums";
import { Action } from "./Action";
import { Project } from "./Project";

@Entity({ name: "Sessions" })
export class Session {

  @PrimaryColumn({ name: "Id" })
  public id!: string;

  @Column({
    name: "Name",
    nullable: true,
  })
  public name: string | undefined;

  @Column({
    name: "State",
    type: "int",
    nullable: false,
    enum: SessionState,
  })
  public state!: SessionState;

  @Column({
    name: "ElapsedTime",
    nullable: false,
  })
  public elapsedTime!: number;

  @Column({
    name: "Steps",
    nullable: false,
  })
  public steps!: number;

  @Column({
    name: "Distance",
    nullable: false,
  })
  public distance!: number;

  @Column({
    name: "AvgSpeed",
    nullable: false,
  })
  public avgSpeed!: number;

  @Column({
    name: "MaxSpeed",
    nullable: false,
  })
  public maxSpeed!: number;

  @Column({
    name: "Events",
    nullable: false,
  })
  public events!: number;

  @Column({
    name: "StartDate",
    nullable: true,
  })
  public startDate!: Date;

  @Column({
    name: "FinishDate",
    nullable: true,
  })
  finishDate?: Date;

  @Column({
    name: "ActionStartDate",
    nullable: false,
  })
  actionStartDate!: Date;

  @Column({
    name: "ActionFinishDate",
    nullable: true,
  })
  actionFinishDate?: Date;

  @Column({
    name: "CreatedDate",
    nullable: false,
  })
  createdDate!: Date;

  @OneToOne(() => Project, x => x.id)
  @JoinColumn({ name: "ProjectId" })
  public project!: Project;

  @OneToOne(() => Action, x => x.id)
  @JoinColumn({ name: "ActionId" })
  public action!: Action;

}
