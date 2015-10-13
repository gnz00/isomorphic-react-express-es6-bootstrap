import React, { Component, PropTypes } from 'react';

class FileUploadForm extends Component {

  render() {
    return (
      <form>
        <input type="file" onChange={this.handleFileInputChanged}/>
        <button type="submit">Submit</button>
      </form>
    );
  }

  handleFileInputChanged() {
    console.log('what');
  }

}

export default FileUploadForm;
