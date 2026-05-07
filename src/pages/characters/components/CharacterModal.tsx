import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { axiosInstance } from "@/lib/axios";
import { ranks, skillNames } from "@/lib/constants";
import type { Character, UnlockProgress } from "@/types";
import { Check, ChevronRight, Flag, Save } from "lucide-react";
import SkillLevelInput from "./SkillLevelInput";
import LevelSelector from "./LevelSelector";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/layout/components/ConfirmDialog";
import { useCharacterProgressStore } from "@/store/CharacterProgressStore";

interface CharacterModalProps {
  character: Character | null;
  open: boolean;
  onClose: () => void;
}

const getCharacterIcon = (id: string) => {
  const normId = id.toLowerCase().replace(/[_\s]/g, "-");
  return `${axiosInstance.defaults.baseURL}/characters/${normId}/images/icon`;
};

const CharacterModal = ({ character, onClose }: CharacterModalProps) => {
  const {
    charactersProgress,
    updateLevel,
    updateSkills,
    updateTalents,
    resetCharacter,
  } = useCharacterProgressStore();

  const completeLeveling = () => {};

  const completeTalents = () => {};

  const completeSkills = () => {};

  if (!character) return null;
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="w-[650px] !max-w-none mt-6 p-0 overflow-hidden bg-zinc-900 shadow-lg"
        style={{ top: "1rem", transform: "translateY(50%)" }}
      >
        <DialogHeader className="flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-zinc-800 to-zinc-700 border-b border-zinc-700">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-600 justify-center">
            <img
              src={getCharacterIcon(character.id)}
              alt={character.name}
              className="object-cover w-full h-full"
            />
          </div>
          <DialogTitle className="text-2xl font-bold">
            {character.name}
          </DialogTitle>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-3"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <ConfirmDialog
              title="Reset character"
              description="All progress will be reset"
              onConfirm={() => {
                onClose();
                resetCharacter(character.id);
              }}
              trigger={
                <Button
                  variant="secondary"
                  size="sm"
                  className="px-3 bg-red-700 hover:bg-red-600 font-semibold"
                >
                  Reset
                </Button>
              }
            />
          </div>
        </DialogHeader>
        <div className="p-2">
          <Tabs defaultValue="level" className="w-full">
            <TabsList className="flex w-full justify-center gap-2 mb-4 bg-zinc-800 p-1 rounded-lg">
              <TabsTrigger
                value="level"
                className="data-[state-active]:bg-zinc-700 data-[state-active]:text-white"
              >
                Level
              </TabsTrigger>
              <TabsTrigger
                value="forte"
                className="data-[state-active]:bg-zinc-700 data-[state-active]:text-white"
              >
                Forte
              </TabsTrigger>
            </TabsList>

            <TabsContent value="level" className="space-y-4">
              <div className="bg-zinc-800 text-center p-2 rounded-md font-medium">
                Level
              </div>

              <div className="flex items-center justify-center space-x-4">
                <LevelSelector
                  ascension={
                    charactersProgress[character.id].level.currentAscensionLevel
                  }
                  level={charactersProgress[character.id].level.currentLevel}
                  onSelect={(lvl, ascension) =>
                    updateLevel(character.id, "current", lvl, ascension)
                  }
                />
                <ChevronRight className="h-6 w-6" />
                <LevelSelector
                  ascension={
                    charactersProgress[character.id].level.targetAscensionLevel
                  }
                  level={charactersProgress[character.id].level.targetLevel}
                  onSelect={(lvl, ascension) =>
                    updateLevel(character.id, "target", lvl, ascension)
                  }
                  minValue={
                    charactersProgress[character.id].level.currentLevel ?? 1
                  }
                />
              </div>
              <div className="flex justify-end">
                <ConfirmDialog
                  title="Finish Character"
                  description="Materials will be consumed"
                  onConfirm={() => completeLeveling()}
                  trigger={
                    <Button className="font-semibold px-6 py-2 rounded-lg shadow-md">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  }
                />
              </div>
            </TabsContent>
            <TabsContent value="forte" className="space-y-4">
              <div className="bg-zinc-800 text-center p-2 rounded-md font-medium">
                Forte
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  {skillNames.map((skill) => (
                    <div className="flex flex-col items-center" key={skill}>
                      <div className="rounded px-2 py-0.5 text-sm font-medium bg-zinc-600 mb-2">
                        {skill}
                      </div>

                      <div className="flex items-center justify-center space-x-2">
                        <SkillLevelInput
                          value={
                            charactersProgress[character.id]?.skills[skill]
                              .currentSkillLevel ?? 1
                          }
                          onChange={(val) =>
                            updateSkills(
                              character.id,
                              "currentSkillLevel",
                              skill,
                              val,
                            )
                          }
                        />

                        <ChevronRight className="h-5 w-5 text-zinc-400" />

                        <SkillLevelInput
                          value={
                            charactersProgress[character.id]?.skills[skill]
                              .targetSkillLevel ?? 1
                          }
                          onChange={(val) =>
                            updateSkills(
                              character.id,
                              "targetSkillLevel",
                              skill,
                              val,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {ranks.map((rank) => (
                      <div key={rank}>
                        <h4 className="text-sm font-medium mb-2 bg-zinc-600 py-1 px-0.5 rounded text-center">
                          Stat bonus Rank {rank}
                        </h4>
                        <div className="flex items-center justify-center gap-2">
                          {charactersProgress[character.id].bonusStats[
                            rank
                          ].map((bonus, index) => (
                            <ToggleGroup
                              className="flex flex-row"
                              type="single"
                              key={index}
                              value={bonus}
                              onValueChange={(val) =>
                                updateTalents(
                                  character.id,
                                  "bonusStats",
                                  rank,
                                  val as UnlockProgress,
                                  index,
                                )
                              }
                            >
                              <ToggleGroupItem
                                value="planned"
                                className="bg-zinc-600 hover:bg-zinc-500"
                              >
                                <Flag />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="done"
                                className="bg-zinc-600 hover:bg-zinc-500"
                              >
                                <Check />
                              </ToggleGroupItem>
                            </ToggleGroup>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div>
                      <h4 className="text-sm font-medium mb-2 bg-zinc-600 py-1 px-0.5 rounded text-center">
                        Inherent Skills
                      </h4>
                      <div className="flex items-center justify-center gap-2">
                        {Object.entries(
                          charactersProgress[character.id].inherentSkills,
                        ).map(([rank, skill]) => (
                          <ToggleGroup
                            key={rank}
                            className="flex flex-row"
                            type="single"
                            value={skill}
                            onValueChange={(val) =>
                              updateTalents(
                                character.id,
                                "inherentSkills",
                                Number(rank),
                                val as UnlockProgress,
                              )
                            }
                          >
                            <ToggleGroupItem
                              className="bg-zinc-600 hover:bg-zinc-500"
                              value="planned"
                            >
                              <Flag />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              className="bg-zinc-600 hover:bg-zinc-500"
                              value="done"
                            >
                              <Check />
                            </ToggleGroupItem>
                          </ToggleGroup>
                        ))}
                      </div>
                      <div className="flex justify-center mt-5">
                        <Button
                          onClick={() => {
                            completeTalents();
                            completeSkills();
                          }}
                          className="font-semibold px-6 py-2 rounded-lg shadow-md"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterModal;
