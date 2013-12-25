
# Imagine this:
# 
# You have a git repo for your node.js application. You want to write a deployment script for this.
#
# Deployment process involves:
#  - pulling the code from a git repo
#  - install dependencies
#  - make sure server serves the new code
#
#  Here are a few other requirements:
#  - IF any of this fails, roll back to the server running the old code (restart the server with 
#    the old code)
#  - keep track of the last 5 deployments, so its easy to roll back. Make sure to clean up older
#    deployments. We do not want to greedily consume disk space.
#  - the current code of the application should always be available at "~/apps/$appName"
#
# Lets start with the last requirement. This can happen by putting the running code in this 
# location OR by putting the running code in some other location and symlinking this path to the
# real location.
#
# The advantage of symlinking is, you can change the symlink in the last minute from the old code 
# to the new code, reducing downtime. Also keeping the real code in different directories makes it
# easy to maintain a "history of deployments" (the last 5 in our case). If the new code doesn't
# deploy, we can quickly switch the symlink back to the old code and restart the server.
#
# Now the deployment process looks like this:
#  - make a deployment directory
#  - pull code from a particular git repo/branch into this directory
#  - install the dependencies for the code
#  - stop the current running version of the app
#  - locate the last deployment directory
#  - overwrite the ~/apps/$appName link to the new deployment directory
#  - start the server from ~/apps/$appName (now pointing to the new deployment)
#  - IF this fails, roll back to the server running the old code (restart the server with 
#    the old code)
#  - add the new deployment directory to the history of deployment directories
#  - delete anything older than the last 5 deployment directories
#
# Script starts below.
#




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

  loop (lines($command.out) : $dir) {
    rm -rf $dir # failable
    
    if (!$command.ok) {
      #! Could not remove $dir. Code: $command.code, Error: $command.err
    }
  }
}