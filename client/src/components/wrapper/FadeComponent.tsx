import { useTransition, animated } from 'react-spring';

interface FadeComponentProps {
  show: boolean;
  children: React.ReactNode;
}

const FadeComponent: React.FC<FadeComponentProps> = ({ show, children }) => {
  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return transitions((style, item) =>
    item ? (
      <animated.div
        className="flex justify-center items-center h-full"
        style={style}
      >
        {children}
      </animated.div>
    ) : null
  );
};

export default FadeComponent;
