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

const explanationQuestions: Question[] = [
  {
    question: "What is the past participle of 'go'?",
    answer: "gone",
    choices: ["go", "went", "gone", "going"],
    explanation:
      "'Gone' is the past participle form of 'go'. It is used with 'have/has/had' to form perfect tenses.",
    example: "She has gone to the store.",
  },
  {
    question: "Which word is a synonym for 'happy'?",
    answer: "joyful",
    choices: ["sad", "angry", "joyful", "tired"],
    explanation:
      "'Joyful' means feeling, expressing, or causing great pleasure and happiness.",
    example: "The children were joyful at the party.",
  },
];

export const Default: Story = {
  args: {
    type: "storybook-demo",
    questions: sampleQuestions,
  },
};

export const WithExplanation: Story = {
  args: {
    type: "storybook-explanation",
    questions: explanationQuestions,
  },
};
