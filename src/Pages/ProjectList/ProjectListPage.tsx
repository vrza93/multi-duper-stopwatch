import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Alert } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { SessionState, SettingKey } from "@data";
import { GetAllResultItem } from "@dto/Projects";
import { useFocusEffect } from "@react-navigation/native";
import { IActiveProjectService } from "@services/ActiveProject";
import { IProjectService } from "@services/Projects";
import { ISessionService } from "@services/Sessions";
import { ISettingsService } from "@services/Settings";
import { styles } from "@styles";
import { useLocalization } from "@utils/LocalizationUtils";
import { useNavigation } from "@utils/NavigationUtils";
import { projectListPageStyles } from "./ProjectListPageStyles";

const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);
const sessionService = serviceProvider.get<ISessionService>(ServiceIdentifier.SessionService);
const settingsService = serviceProvider.get<ISettingsService>(ServiceIdentifier.SettingsService);
const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);

export function ProjectListPage(): JSX.Element {
  const navigation = useNavigation();
  const localization = useLocalization();

  // TODO: Use view model instead of DTO
  const [list, setList] = useState<Array<GetAllResultItem>>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);

  const load = async(): Promise<void> => {
    setShowLoadingIndicator(true);

    const data = await projectService.getAll();

    setList(data.items);
    setShowLoadingIndicator(false);
  };

  const requestToDeleteProject = (project: GetAllResultItem): void => {
    Alert.alert(
      localization.get("projectList.confirmationTitle"),
      localization.get("projectList.confirmationMessage", { projectName: project.name }),
      [
        {
          text: localization.get("projectList.cancel"),
          style: "cancel",
        },
        {
          text: localization.get("projectList.delete"),
          onPress: (): void => {
            deleteProject(project.id);
          },
        },
      ]
    );
  };

  const deleteProject = async(projectId: string): Promise<void> => {
    setShowLoadingIndicator(true);

    await projectService.delete(projectId);
    await load();
  };

  useFocusEffect(
    useCallback(
      (): void => {
        load();
      },
      []
    )
  );

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <ScrollView style={styles.contentView}>
      <View>
        <View style={styles.table}>
          {
            list.map((x: GetAllResultItem, index: number): JSX.Element => {
              return (
                <View
                  key={x.id}
                  style={[
                    styles.tableRow,
                    index !== list.length - 1
                      ? projectListPageStyles.tableRow
                      : undefined,
                  ]}
                >
                  <View
                    style={[
                      styles.tableCell,
                      projectListPageStyles.projectNameCol,
                    ]}
                  >
                    <Text>
                      {x.name}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Button
                      variant="primary"
                      onPress={async(): Promise<void> => {
                        // TODO: Business logic service
                        const lastSessionId = await settingsService.get(SettingKey.LastSessionId);

                        if (lastSessionId) {
                          const session = await sessionService.get(lastSessionId);

                          if (session.state !== SessionState.Finished) {
                            await sessionService.finish({
                              sessionId: lastSessionId,
                              avgSpeed: 0,
                              distance: 0,
                              maxSpeed: 0,
                              date: undefined,
                            });
                          }

                          await settingsService.set(
                            SettingKey.LastSessionId,
                            null
                          );
                        }

                        await activeProjectService.reset();
                        // --

                        navigation.navigate(
                          Routes.Home,
                          {
                            projectId: x.id,
                          }
                        );
                      }}
                    >
                      <Icon
                        name="play"
                        variant="primary-contrast"
                      />
                    </Button>
                  </View>
                  <View style={styles.tableCell}>
                    <Button
                      variant="secondary"
                      onPress={(): void => {
                        navigation.navigate(
                          Routes.Project,
                          {
                            projectId: x.id,
                          }
                        );
                      }}
                    >
                      <Icon
                        name="edit"
                        variant="secondary-contrast"
                      />
                    </Button>
                  </View>
                  <View style={styles.tableCell}>
                    <Button
                      variant="danger"
                      onPress={(): void => {
                        requestToDeleteProject(x);
                      }}
                    >
                      <Icon
                        name="delete"
                        variant="danger-contrast"
                      />
                    </Button>
                  </View>
                </View>
              );
            })
          }
          {
            list.length === 0
              && (
                <View>
                  <Text style={projectListPageStyles.noProjects}>
                    {localization.get("projectList.noProjects")}
                  </Text>
                  <Button
                    title={localization.get("projectList.createProject")}
                    variant="primary"
                    style={styles.mt16}
                    onPress={(): void => {
                      navigation.navigate(Routes.Project);
                    }}
                  />
                </View>
              )
          }
        </View>
      </View>
    </ScrollView>
  );
}
