import { useGame } from '../store/gameStore';
import { CameraRig } from './shared/CameraRig';
import { ErrorBoundary } from '../components/UI/ErrorBoundary';
import GardenScene from './GardenScene';
import HouseScene from './HouseScene';
import SecretRoomScene from './SecretRoomScene';

// InvitationScene & FinalSurpriseScene memakai GardenScene (malam) dengan overlay/sinematik berbeda.
export function SceneSwitch() {
  const scene = useGame((s) => s.scene);
  return (
    <>
      <CameraRig />
      <ErrorBoundary label={'scene-' + scene}>
        {scene === 'house' ? <HouseScene /> : scene === 'secret' ? <SecretRoomScene /> : <GardenScene />}
      </ErrorBoundary>
    </>
  );
}
