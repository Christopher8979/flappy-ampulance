function tickHandler(event) {
    // Check if game has started
    if (currentstate == states.GameScreen) {

        // Gravity
        if (bird.y >= gameFloor) {
            velocity = 0
            playerDead()
        } else if (bird.y <= gameCeil) {
            velocity = 0
            bird.y = gameCeil + 1;
        } else {
            velocity += gravity;
            bird.y += velocity;
        }
        bird.rotation = Math.min((velocity / 50) * 90, 90);

        // Pipes collision
        var pipe = pipes[0];
        var birdBound = bird.getBounds();
        var pipeWidth = pipe.getBounds().width;
        var outOfBounds = (pipe.start > bird.y || pipe.end < (bird.y + birdBound.height))
        var enteredPipe = (pipe.x < bird.x+birdBound.width)
        var exitedPipe = (pipe.x+pipeWidth < bird.x);

        // Check if the bird enterd the pipe
        if (enteredPipe) {
            // Test if hit
            if (outOfBounds) {
                console.log("Hit");
                velocity = 0;
                playerDead();
            }

        }
        
        // Check if the bird exited the pipe safely
        if (exitedPipe) {
            pipes.push(pipes.shift())
            score++;
            updateScore();
        }
    }

    stage.update(event)
}