//
//  Created by Jasperit on 2/6/12.
//  Copyright (c) 2012 Jasper IT Pvt Ltd. All rights reserved.
// http://www.jasperitsolutions.com
//

/*
 Copyright (c) 2012, Ajeet Shakya
 
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 
 * Neither the name of the Zang Industries nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 Copyright 2011 AJEET SHAKYA
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

#define RGB(a, b, c) [UIColor colorWithRed:(a / 255.0f) green:(b / 255.0f) blue:(c / 255.0f) alpha:1.0f]
#define RGBA(a, b, c, d) [UIColor colorWithRed:(a / 255.0f) green:(b / 255.0f) blue:(c / 255.0f) alpha:d]

#import <UIKit/UIKit.h>
@class AJComboBox;

@protocol AJComboBoxDelegate

@required

-(void)didChangeComboBoxValue:(AJComboBox *)comboBox selectedIndex:(NSInteger)selectedIndex;

@end

@interface AJComboBoxItem : NSObject
{
    NSString* label;
    NSString* value;
    BOOL isselected;
}
@property (nonatomic, retain) NSString* label;
@property (nonatomic, retain) NSString* value;
@property (nonatomic, assign) BOOL isselected;

- (id) initWithLabel:(NSString*) inlabel andValue:(NSString*) invalue andSelected:(BOOL) inisselected;
+ (AJComboBoxItem*) withLabel:(NSString*) inlabel andValue:(NSString*) invalue andSelected:(BOOL) inisselected;

@end

@interface AJComboBox : UIView <UITableViewDataSource, UITableViewDelegate>
{
    UIButton *button;
    UIControl *viewControl;
    UITableView *_table;
    BOOL singleselect;
}
@property () CGFloat dropDownHeight;
@property (nonatomic, retain) NSArray *arrayData;
@property (nonatomic,assign) id<AJComboBoxDelegate> delegate;
@property (nonatomic, retain) NSString *labelText;
@property () BOOL enabled;
@property (nonatomic, assign) BOOL singleselect;

- (void) buttonPressed;
- (void) controlPressed;
- (void) setButtonLabelFromSelectedValues;

@end
