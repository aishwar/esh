
Usage {
  '-v, --version: Prints the version number of this script'
  '-p, --properties <filename>: File that contains the property values for this script'
  'This is a node.js deployment script. It pulls code from a remote repo and deploys it locally.'
}

Main {
  if ($arg.version) {
    ## Version 0.1
    exit:ok
  }
  
  ## Creating and switching to the new deployment directory
  mkdir -p $deployment.newdir
  cd $deploy.newdir

  ## Getting the lastest code from the repo
  git clone $repo

  ## Switching to the production branch
  git checkout prod

  ## Install node.js dependencies
  npm install

  ## Stopping the running server
  forever stop $app.path

  ## Link the application to the new deployment directory
  ln -sfn $app.path $deployment.newdir

  ## Starting the server running the new code
  forever start $app.path

  ## Add the new deployment directory to the deployment history
  echo $deployment.newdir >> $deployment.history
}

OnError {
  ## Reverting to old deployment due to error in deploying new code
  ln -sfn $app.path $deployment.olddir
  ## Starting the server
  forever start $app.path
  ## Remove the new directories created
  rm -rf $deployment.newdir
}

CleanUp {
  ## Cleaning up older deployments
  # Locate anything older than the last $deployment.keep_history deployments
  head -n -$deployment.keep_history
}
