import { useBeaconContext } from "../context/BeaconContext";

export function useTrigger() {
  const { isOpen, toggle, open, close } = useBeaconContext();
  return { isOpen, toggle, open, close };
}
