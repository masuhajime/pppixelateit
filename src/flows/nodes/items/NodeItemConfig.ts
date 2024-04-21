export default class NodeItemConfig {
  static handleSize = 24;

  static handleStyleFilled = (
    color: string,
    handlePositionTop: number,
    side: 'right' | 'left',
  ) => {
    const sideStyle =
      side === 'right'
        ? {
            right: -this.handleSize / 2,
          }
        : {
            left: -this.handleSize / 2,
          };
    return {
      ...{
        background: color,
        borderWidth: '0',
        width: this.handleSize,
        height: this.handleSize,
        top: handlePositionTop,
      },
      ...sideStyle,
    };
  };

  static handleStyleBordered = (
    color: string,
    handlePositionTop: number,
    side: 'right' | 'left',
  ) => {
    const sideStyle =
      side === 'right'
        ? {
            right: -this.handleSize / 2,
          }
        : {
            left: -this.handleSize / 2,
          };
    return {
      ...{
        opacity: '0.8',
        background: 'rgba(128, 128, 128, .1)',
        borderWidth: '3px',
        borderColor: color,
        width: this.handleSize - 6,
        height: this.handleSize - 6,
        top: handlePositionTop,
      },
      ...sideStyle,
    };
  };
}
