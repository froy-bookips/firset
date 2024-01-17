#!/usr/bin/env zx

async function main() {
  try {
    // intro with ASCII art and color
    console.log(`
    \x1b[36m
      ______________  _____ ____________
      / ____/  _/ __ \\/ ___// ____/_  __/
     / /_   / // /_/ /\\__ \\/ __/   / /   
    / __/ _/ // _, _/___/ / /___  / /    
   /_/   /___/_/ |_|/____/_____/ /_/    
    \x1b[0m
    `);

    // input username
    console.log("please enter your github username:")
    const username = await stdin();


    // get email
    console.log("please enter your github email:")
    const email = await stdin();

    // set git config
    await $`git config --global user.name ${username}`.catch((err) => {
      console.error("Error setting git username:", err);
      process.exit(1);
    }
    );
    await $`git config --global user.email ${email}`.catch((err) => {
      console.error("Error setting git email:", err);
      process.exit(1);
    }
    );

    // Check if GitHub CLI is installed
    await $`which gh`.catch(() => {
      console.log("Installing GitHub CLI...");
      if (process.platform === "linux") {
        $`sudo apt-get install gh`.catch(() => {
          console.error("Failed to install GitHub CLI on Linux.");
          process.exit(1);
        });
      } else if (process.platform === "darwin") {
        $`brew install gh`.catch(() => {
          console.error("Failed to install GitHub CLI on macOS.");
          process.exit(1);
        });
      } else {
        console.error("Unsupported platform for automatic installation of GitHub CLI.");
        process.exit(1);
      }
    });

    // Github login
    await $`gh auth login -h github.com -s admin:public_key`.catch((err) => {
      console.error("Error logging into GitHub:", err);
      process.exit(1);
    });
    
    // // gh auth refresh -h github.com -s admin:public_key
    // await $`gh auth refresh -h github.com -s admin:public_key`.catch((err) => {
    //   console.error("Error refreshing GitHub auth:", err);
    //   process.exit(1);
    // });

    // Generate SSH key
    const keyPath = `${os.homedir()}/.ssh/id_rsa`;
    await $`ssh-keygen -t rsa -b 4096 -f ${keyPath} -N ''`.catch((err) => {
      console.error("Error generating SSH key:", err);
      process.exit(1);
    });

    // Register SSH key with GitHub
    await $`gh ssh-key add ${keyPath}.pub`.catch((err) => {
      console.error("Error registering SSH key with GitHub:", err);
      process.exit(1);
    });

    // Update ~/.ssh/config
    const sshConfigPath = `${os.homedir()}/.ssh/config`;
    await fs.appendFile(sshConfigPath, `\nHost github.com\n  IdentityFile ${keyPath}\n`).catch((err) => {
      console.error("Error updating SSH config:", err);
      process.exit(1);
    });

    console.log("SSH key generation and registration complete.");
  } catch (err) {
    console.error("An error occurred:", err);
    process.exit(1);
  }
}

main();
