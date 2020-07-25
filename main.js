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
      docker.run(docker_image, ['godot', '-d', '-s', '--path /builder', 'addons/gut/gut_cmdln.gd'], process.stdout, 
      
      // Mount working directory to `/builder`
      { HostConfig: { Binds: [ process.cwd() + ":/builder" ] }},
      
      function (err, data, container) {

        if(err)
        {
          console.log(err);
        }
      
      })
    }
    function onProgress(event) {}

  });

} catch (error) {
  core.setFailed(error.message);
}