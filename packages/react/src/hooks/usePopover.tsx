import { useBeaconContext } from "../context/BeaconContext";

export function usePopover() {
  const { isOpen, close, dismiss } = useBeaconContext();
  return { isOpen, close, dismiss };
}
