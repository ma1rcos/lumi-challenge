import { HBoxProps } from './interface';

const HBox: React.FC<HBoxProps> = ({width}: HBoxProps) => {
  return (
    <div
        style={{width: width}}
    />
  );
}

export default HBox;