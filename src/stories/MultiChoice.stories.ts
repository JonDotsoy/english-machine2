import MultiChoice from "../components/MultiChoice";
import type { Question } from "../components/dto/question";
import type { Meta, StoryObj } from "@storybook/react-vite";

type MetaComponent = Meta<typeof MultiChoice>;
type Story = StoryObj<MetaComponent>;

export default {
  title: "Quiz/MultiChoice",
  component: MultiChoice,
  argTypes: {
    type: { control: "text" },
    questions: { control: "object" },
  },
} satisfies MetaComponent;

const sampleQuestions: Question[] = [
  {
    question: "What is the past continuous tense?",
    answer: "It describes actions that were ongoing in the past.",
    example: "I was eating dinner when you called.",
    choices: [
      "It describes actions that were ongoing in the past.",
      "It describes future actions.",
      "It describes completed actions.",
    ],
    meaning: "Used for actions happening at a specific moment in the past.",
  },
  {
    question: "Choose the correct form: 'She ___ reading when I arrived.'",
    answer: "was",
    choices: ["was", "were", "is"],
    example: "She was reading when I arrived.",
    meaning: "Past continuous uses 'was' or 'were' + verb-ing.",
  },
];

export const Default: Story = {
  args: {
    type: "storybook-demo",
    questions: sampleQuestions,
  },
};
