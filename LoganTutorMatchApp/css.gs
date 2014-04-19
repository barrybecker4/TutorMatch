/**
 * This is not a real CSS file, but it allows us to decouple the styling from the code.
 * See http://www.harryonline.net/scripts/stylesheets-in-google-apps-script-uiapp/494
 */
var css={};
var TEXT_FONT = 'sans-serif';
var TEXT_COLOR = '#0066aa';
var DISABLED_TEXT_COLOR = '#bbbbbb';

css.body = { 
  margin:'20px auto',
  border: '1px solid #ccc',
  padding:'10px',
  fontFamily: TEXT_FONT,
  color: TEXT_COLOR,
};

css.grid = {
  //padding: 10,
  //margin: 10,
  //borderWidth: 1,
  //borderColor: 'aaaaaa',
  //borderStyle: 'solid',
  width: 740
};

css.smallGridCell = {
  padding: 2,
  margin: 4,
  fontFamily: TEXT_FONT,
  color: TEXT_COLOR,
  borderWidth: 1,
  borderColor: TEXT_COLOR,
  borderStyle: 'solid'
};

css.largeGridCell = {
    padding: 8,
    margin: 5,
    fontFamily: TEXT_FONT,
    color: TEXT_COLOR,
    //borderWidth: 3,
    //borderColor: 'f3f3fe',
    //borderStyle: 'solid'
  };


css.title = {
  fontSize: 42,
  fontWeight: 'bold',
  padding: 20
};

css.text = { 
  color: TEXT_COLOR,
  fontSize: 20,  
};

css.smallText = { 
    color: TEXT_COLOR,
    fontSize: 12, 
 };

css.warning = { 
    color: '#ff4400',
    fontSize: 24,  
};

css.link = {
  padding: 10,
  fontSize: 20,
  color: TEXT_COLOR, 
};

css.hiddenLink = {
  zIndex: 1,
  position: 'absolute',
  top: 8, 
  left: 10, 
  fontSize: 20,
  color: 'transparent' // '#8899ff' 
};

css.button = {
  color: TEXT_COLOR,
  fontSize: 20,  
  borderRadius: '4px'
};

css.buttonDisabled = {
  color: DISABLED_TEXT_COLOR,
  fontSize: 20,  
  borderRadius: '6px' 
};

css.textbox = {
    marginLeft: 24,
    fontSize: 20,
    //fontFamily: TEXT_FONT,
    color: TEXT_COLOR, 
  };

css.popup = {
    padding: 40,
    borderWidth: 3,
    borderColor: '11aa99',
    borderStyle: 'solid', 
  };

css.droplist = {
  //padding: 5,
  marginTop: 10,
  marginBottom: 20,
  marginLeft: 24,
  fontSize: 20,
  //fontFamily: TEXT_FONT,
  color: TEXT_COLOR, 
};

css.languageLabel = {
    marginLeft : 500,
    paddingTop: 1,
    fontSize: 10,
    fontFamily: TEXT_FONT,
    color: TEXT_COLOR, 
  };

css.languageDroplist = {
    fontSize: 10,
    fontFamily: TEXT_FONT,
    color: TEXT_COLOR, 
    
 };

css.notification = {
  border: '2px solid #0c0',
  padding:'0.5em', 
  margin:'1em 0'
};

/** allows for children to have absolute positioning relative to this parent */
css.buttonPanel = {
  position: 'relative'
};
