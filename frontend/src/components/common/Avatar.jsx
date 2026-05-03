import React from 'react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  // Size classes mapped to index.css utility classes if they existed, or inline styles
  const sizeMap = {
    sm: '32px',
    md: '40px',
    lg: '56px',
    xl: '80px',
  };

  const dimension = sizeMap[size] || sizeMap.md;
  const fontSize = `calc(${dimension} / 2.5)`;

  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-elevated)',
    border: '2px solid var(--border-default)',
    flexShrink: 0,
  };

  if (src) {
    return (
      <div style={containerStyle} className={`avatar-container ${className}`}>
        <img
          src={src}
          alt={`${name}'s avatar`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  // Get initials (up to 2 letters)
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent background color based on name string
  const getBgColor = (name) => {
    if (!name) return 'var(--clr-primary-dark)';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'var(--clr-primary)',
      'var(--clr-accent)',
      '#FF9800',
      '#4CAF50',
      '#F44336',
      '#9C27B0'
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`avatar-container ${className}`}
      style={{
        ...containerStyle,
        backgroundColor: getBgColor(name),
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: fontSize,
        letterSpacing: '1px'
      }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
