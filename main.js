const core = require('@actions/core');
const fs = require('fs');
const path = require('path')

// Setup Docker
const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

try {

  // Get inputs
  var docker_image = core.getInput('containerImage');
  var work_dir = core.getInput('directory');

  process.chdir(work_dir);

  // Pull docker image for building
  console.log("Pulling build image...");
  docker.pull(docker_image, function(err, stream)
  {

    docker.modem.followProgress(stream, onFinished, onProgress);

    // Wait to run build until after pull complete
    function onFinished(err, output)
    {
      console.log("Starting image...")
      docker.run(docker_image, ['godot', '-d', '-s', '--path', '/project', 'addons/gut/gut_cmdln.gd'], process.stdout, 
      
      // Mount working directory to `/project`
      { HostConfig: { Binds: [ process.cwd() + ":/project" ] }},
      
      function (err, data, container) {

        if(err)
        {
          core.setFailed(error.message);
        }

        console.log("Tests exited with status: " + data.StatusCode);

        if( data.StatusCode != "0" )
        {
            core.setFailed("GUT tests failed!");
        }
    
      })
    }
    function onProgress(event) {}

  });

} catch (error) {
  core.setFailed(error.message);
}