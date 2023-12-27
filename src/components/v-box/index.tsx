import { VBoxProps } from './interface';

const VBox: React.FC<VBoxProps> = ({height}: VBoxProps) => {
  return (
    <div
        style={{height: height}}
    />
  );
}

export default VBox;