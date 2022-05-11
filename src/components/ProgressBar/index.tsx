import styled from 'styled-components/macro'

const Container = styled.div<{ width?: string }>`
  progress {
    margin-right: 8px;
  }

  progress[value] {
    width: ${(props) => props.width};

    -webkit-appearance: none;
    appearance: none;
  }

  progress[value]::-webkit-progress-bar {
    height: 10px;
    border-radius: 20px;
    background-color: #eee;
  }

  progress[value]::-webkit-progress-value {
    height: 10px;
    border-radius: 20px;
    background-color: ${(props) => props.color};
  }
`

// const ProgressBar = ({ value, max, color, width }) => {
//   return (
//     <Container color={color} width={width}>
//       <progress value={value} max={max} />
//       <span>{(value / max) * 100}%</span>
//     </Container>
//   )
// }

// ProgressBar.propTypes = {
//   value: PropTypes.number.isRequired,
//   max: PropTypes.number,
//   color: PropTypes.string,
//   width: PropTypes.string,
// }

// ProgressBar.defaultProps = {
//   max: 100,
//   color: 'lightBlue',
//   width: '250px',
// }

// export default ProgressBar
