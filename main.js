Hooks.on('ready', async function(){

  if(game.user.isGM){

    // Set all players ready to false
    await setAllToNotReady();

    // Add button for GM
    let title = game.i18n.localize("READYCHECK.UiCheckButton");
    const readyCheckBtn = $(`<a class="chat-control-icon ready-check" title="` + title + `"><i class="fas fa-hourglass-half"></i></a>`);
    jQuery(".chat-control-icon").before(readyCheckBtn);

    // Add event listener
    jQuery(".ready-check").click(async (event) => {
      event.preventDefault();
      let data = {action: 'check'};
      await setAllToNotReady();
      game.socket.emit('module.ready-check', data);
    });

  } else {

    // Add button for players
    let title = game.i18n.localize("READYCHECK.UiChangeButton");
    const readyCheckBtn = $(`<a class="chat-control-icon ready-check" title="` + title + `"><i class="fas fa-hourglass-half"></i></a>`);
    jQuery(".chat-control-icon").before(readyCheckBtn);

    // Add event listener
    jQuery(".ready-check").click(async (event) => {
      event.preventDefault();
      displayReadyDialog(false);  //false here means the GM did not send this request
    });
  }

  // Do stuff when the socket is triggered
  game.socket.on('module.ready-check', async (data) =>{

    // Error handling
    if(!data){
      ui.notifications.error(game.i18n.localize("READYCHECK.Error"));
    }

    // Sending
    else if(data.action === 'check'){
      displayReadyDialog(true);  //true here means the GM sent the request
    }

    // Responding
    else if (data.action === 'reply'){
      processReadyResponse(data);
    }

  });

});

Hooks.on('renderPlayerList', async function(){
  // Cycle through each player and update the ready status icon in the player window
  for(var i=0; i < game.users.players.length; i++){
    let ready = await game.users.players[i].getFlag('ready-check','isReady');
    let userId = game.users.players[i].data._id;
    let userName = game.users.players[i].data.name;
    let indicator;

    // Construct the indicator
    if(ready){
      let title = game.i18n.localize("READYCHECK.PlayerReady");
      indicator = `<i class="fas fa-check ready-indicator ready" title="` + title + `"></i>`;
    }
    else {
      let title = game.i18n.localize("READYCHECK.PlayerNotReady");
      indicator = `<i class="fas fa-times ready-indicator not-ready" title="` + title + `"></i>`;
    }

    // Add the indicator to the end of the line
     $("#players").find("[data-user-id="+userId+"]").append(indicator);
  }
})

// DISPLAY READY CHECK DIALOG AND SEND RESPONSE TO GM (PLAYER)
function displayReadyDialog(fromGM){
  let data = {action: 'reply', ready: false, userId: game.user.data._id};
  let buttons = {yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("READYCHECK.DialogButtonReady"), callback: () => data.ready = true} };
  // If the GM didn't initiate this check, give them the option to set ready status to "no"
  if(!fromGM) {
    buttons.no = {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("READYCHECK.DialogButtonNotReady"), callback: () => data.ready = false};
  }
  new Dialog({
    title: game.i18n.localize("READYCHECK.DialogTitle"),
    content: game.i18n.localize("READYCHECK.DialogContent"),
    buttons: buttons,
    default: "yes",
    close: async () => {
      game.socket.emit('module.ready-check', data);
    }
  }).render(true);
}

// PROCESS READY CHECK RESPONSE (GM)
async function processReadyResponse(data){
  if(game.user.isGM){
    // Get the appropriate user and set the flag
    let userToUpdate = game.users.get(data.userId);
    await userToUpdate.setFlag('ready-check', 'isReady', data.ready);
    // Update the display in the corner
    // Hooks.call('renderPlayerList');
    ui.players.render();
  }
}

// SET ALL USERS STATUS TO NOT READY
async function setAllToNotReady(){
  if(game.user.isGM){
    for(var i=0; i < game.users.players.length; i++){
      await game.users.players[i].setFlag('ready-check','isReady', false);
    }
  }
}
