interface LogoProps {
  size?: number;
}

const Logo = ({ size = 5 }: LogoProps) => {
  return (
    <div className="logo-container">
      <img
        src="/app-dev-club-logo.png"
        alt="App Dev Logo"
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
        }}
      />
    </div>
  );
};

export default Logo;
