import Popover from "./Popover";
import PopoverAcknowledgeButton from "./PopoverAcknowledgeButton";
import PopoverCloseButton from "./PopoverCloseButton";
import PopoverContent from "./PopoverContent";
import PopoverFooter from "./PopoverFooter";
import PopoverTitle from "./PopoverTitle";

export const ReperePopover = Object.assign(Popover, {
  Title: PopoverTitle,
  Content: PopoverContent,
  Footer: PopoverFooter,
  AcknowledgeButton: PopoverAcknowledgeButton,
  CloseButton: PopoverCloseButton,
});
